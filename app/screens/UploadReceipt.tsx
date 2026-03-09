import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image, ScrollView, Platform } from 'react-native';
import { Button, Text, Card, ActivityIndicator, FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../lib/theme';
import { processAndSaveReceipt } from '../services/receiptService';
import { ImageSource } from '../types/services';

export default function UploadReceiptScreen() {
  const navigation = useNavigation<any>();
  const [selectedImage, setSelectedImage] = useState<ImageSource | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'We need access to your camera and photo library to upload receipts.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage({
          uri: result.assets[0].uri,
          width: result.assets[0].width,
          height: result.assets[0].height,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image from gallery');
      console.error(error);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage({
          uri: result.assets[0].uri,
          width: result.assets[0].width,
          height: result.assets[0].height,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
      console.error(error);
    }
  };

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const fileUri = result.assets[0].uri;
        
        // Get image dimensions
        Image.getSize(
          fileUri,
          (width, height) => {
            setSelectedImage({
              uri: fileUri,
              width,
              height,
            });
          },
          () => {
            // If we can't get dimensions, use fallback
            setSelectedImage({
              uri: fileUri,
              width: 1000,
              height: 1000,
            });
          }
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick file');
      console.error(error);
    }
  };

  const processReceipt = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select an image first');
      return;
    }

    setIsProcessing(true);
    setProcessingStep('Processing image...');

    try {
      setProcessingStep('Extracting receipt data...');
      const { receipt } = await processAndSaveReceipt(selectedImage);

      setProcessingStep('Saving receipt...');
      
      // Small delay to show the success state
      await new Promise((resolve) => setTimeout(resolve, 500));

      Alert.alert(
        'Success!',
        `Receipt from ${receipt.store_name} saved successfully!`,
        [
          {
            text: 'View Receipt',
            onPress: () => {
              navigation.navigate('ReceiptDetail', { receiptId: receipt.id });
            },
          },
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to process receipt. Please try again.');
      console.error(error);
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
      setSelectedImage(null);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.title}>
              Upload Receipt
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Take a photo, choose from gallery, or select from files
            </Text>
          </Card.Content>
        </Card>

        {selectedImage ? (
          <Card style={styles.card}>
            <Card.Content>
              <Image source={{ uri: selectedImage.uri }} style={styles.image} />
              <View style={styles.imageActions}>
                <Button
                  mode="outlined"
                  onPress={() => setSelectedImage(null)}
                  style={[styles.button, { marginRight: 12 }]}
                >
                  Remove
                </Button>
                <Button
                  mode="contained"
                  onPress={processReceipt}
                  disabled={isProcessing}
                  loading={isProcessing}
                  buttonColor={theme.colors.primary}
                  style={styles.button}
                >
                  Process Receipt
                </Button>
              </View>
            </Card.Content>
          </Card>
        ) : (
          <View style={styles.uploadOptions}>
            <Button
              mode="contained"
              onPress={takePhoto}
              disabled={isProcessing}
              buttonColor={theme.colors.primary}
              style={styles.uploadButton}
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="camera" size={size} color={color} />
              )}
            >
              Take Photo
            </Button>
            <Button
              mode="outlined"
              onPress={pickImageFromGallery}
              disabled={isProcessing}
              style={styles.uploadButton}
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="image" size={size} color={color} />
              )}
            >
              Choose from Gallery
            </Button>
            <Button
              mode="outlined"
              onPress={pickFile}
              disabled={isProcessing}
              style={styles.uploadButton}
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="file-image" size={size} color={color} />
              )}
            >
              {Platform.OS === 'ios' ? 'Choose from Files' : 'Choose File'}
            </Button>
          </View>
        )}

        {isProcessing && (
          <Card style={styles.card}>
            <Card.Content style={styles.processingContent}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text variant="bodyMedium" style={styles.processingText}>
                {processingStep}
              </Text>
            </Card.Content>
          </Card>
        )}

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text variant="bodySmall" style={styles.infoText}>
              💡 Tip: Make sure the receipt is well-lit and all text is clearly visible
            </Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    flexGrow: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: theme.colors.onSurfaceVariant,
  },
  uploadOptions: {
    // gap replaced with marginBottom on children
  },
  uploadButton: {
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 16,
    resizeMode: 'contain',
    backgroundColor: theme.colors.surfaceVariant,
  },
  imageActions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
  processingContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  processingText: {
    marginTop: 16,
    color: theme.colors.onSurfaceVariant,
  },
  infoCard: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  infoText: {
    color: theme.colors.onSurfaceVariant,
  },
});
