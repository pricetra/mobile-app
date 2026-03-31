import { Feather, FontAwesome6 } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Product, Stock } from 'graphql-utils';
import { ReactNode, useMemo, useState } from 'react';
import { Alert, Linking, Share, TouchableOpacity, View } from 'react-native';

import ProductItem from '@/components/ProductItem';
import Btn from '@/components/ui/Btn';
import Text from '@/components/ui/Text';
import { Textarea } from '@/components/ui/Textarea';
import { useAuth } from '@/context/UserContext';
import {
  generateProductShareDescription,
  generateProductShareLink,
  SocialMediaType,
} from '@/lib/strings';

export type ShareProductFormProps = {
  product: Product;
  stock?: Stock;
  onCancel: () => void;
  onSuccess: () => void;
};

export default function ShareProductForm({
  product,
  stock,
  onCancel,
  onSuccess,
}: ShareProductFormProps) {
  const { user } = useAuth();
  const shareDescription = useMemo(
    () => generateProductShareDescription(product, stock, user, true),
    [product, stock, user]
  );
  const [shareDescriptionText, setShareDescriptionText] = useState(shareDescription);

  async function openSocialShare(socialMedia: SocialMediaType) {
    const shareUrl = generateProductShareLink(socialMedia, product, stock, user);

    let targetUrl = '';
    if (socialMedia === 'facebook') {
      targetUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    }
    if (socialMedia === 'whatsapp') {
      targetUrl = `https://wa.me/?text=${encodeURIComponent(shareUrl)}`;
    }
    if (socialMedia === 'x') {
      targetUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`;
    }
    if (socialMedia === 'nextdoor') {
      targetUrl = `https://nextdoor.com/news_feed/?open_composer=true&body=${encodeURIComponent(shareUrl)}`;
    }

    try {
      const supported = await Linking.canOpenURL(targetUrl);
      if (!supported) {
        Alert.alert('Unable to open link', 'Your device cannot open this sharing link.');
        return;
      }

      await Linking.openURL(targetUrl);
      onSuccess();
    } catch (error: any) {
      Alert.alert('Could not open share link', error?.message ?? 'Please try again.');
    }
  }

  async function copyLink() {
    try {
      await Clipboard.setStringAsync(generateProductShareLink('other', product, stock, user));
      Alert.alert('Copied', 'Product URL copied to clipboard.');
      onSuccess();
    } catch (error: any) {
      Alert.alert('Could not copy URL', error?.message ?? 'Please try again.');
    }
  }

  async function copyDescription() {
    try {
      await Clipboard.setStringAsync(shareDescriptionText);
      Alert.alert('Copied', 'Share text copied to clipboard.');
      onSuccess();
    } catch (error: any) {
      Alert.alert('Could not copy text', error?.message ?? 'Please try again.');
    }
  }

  async function share() {
    try {
      const title = product.name;
      const url = generateProductShareLink('other', product, stock, user);
      const message = shareDescriptionText;

      await Share.share({
        title,
        message,
        url,
      });
    } catch (error: any) {
      Alert.alert('Could not share', error.message ?? 'Please try again.');
    }
  }

  return (
    <View className="mb-10 flex gap-5">
      <View className="rounded-xl border-[1px] border-gray-200 bg-gray-50 p-3">
        <ProductItem product={{ ...product, stock }} hideStoreInfo={false} hideAddButton />
      </View>

      <View className="flex flex-row flex-wrap items-center justify-center gap-3">
        <SocialButton
          title="Facebook"
          backgroundColor="#1877F2"
          icon={<FontAwesome6 name="facebook-f" color="white" size={18} />}
          onPress={() => openSocialShare('facebook')}
        />

        <SocialButton
          title="WhatsApp"
          backgroundColor="#25D366"
          icon={<FontAwesome6 name="whatsapp" color="white" size={20} />}
          onPress={() => openSocialShare('whatsapp')}
        />

        <SocialButton
          title="X"
          backgroundColor="#000000"
          icon={<FontAwesome6 name="x-twitter" color="white" size={18} />}
          onPress={() => openSocialShare('x')}
        />

        <SocialButton
          title="Nextdoor"
          backgroundColor="#1b8751"
          icon={<Text className="text-base font-black color-white">N</Text>}
          onPress={() => openSocialShare('nextdoor')}
        />

        <SocialButton
          title="Copy Link"
          border
          icon={<FontAwesome6 name="link" color="black" size={18} />}
          onPress={copyLink}
        />

        <SocialButton
          title="More"
          border
          icon={<Feather name="more-horizontal" color="black" size={18} />}
          onPress={share}
        />
      </View>

      <View className="mt-2">
        <Textarea
          label="Share message"
          value={shareDescriptionText}
          onChangeText={setShareDescriptionText}
          placeholder="Enter your message"
          className="min-h-[105px]"
        />

        <View className="mt-3 flex flex-row justify-end">
          <Btn
            text="Copy"
            icon={<FontAwesome6 name="copy" size={14} color="white" />}
            onPress={copyDescription}
            size="sm"
            className="bg-black"
          />
        </View>
      </View>

      <View className="mt-10 flex flex-row items-center gap-3">
        <Btn
          onPress={onCancel}
          text="Cancel"
          size="md"
          bgColor="bg-gray-100"
          color="text-gray-700"
        />

        <View className="flex-1">
          <Btn onPress={onSuccess} text="Done" size="md" />
        </View>
      </View>
    </View>
  );
}

type SocialButtonProps = {
  title: string;
  icon: ReactNode;
  onPress: () => void;
  backgroundColor?: string;
  border?: boolean;
};

function SocialButton({
  title,
  icon,
  onPress,
  backgroundColor = '#111827',
  border,
}: SocialButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex w-[76px] items-center gap-2 p-1"
      activeOpacity={0.7}>
      <View
        className={`size-12 items-center justify-center rounded-full ${border ? 'border-[1px] border-gray-300 bg-white' : ''}`}
        style={{ backgroundColor: border ? '#ffffff' : backgroundColor }}>
        {icon}
      </View>
      <Text className="text-xs text-black">{title}</Text>
    </TouchableOpacity>
  );
}
