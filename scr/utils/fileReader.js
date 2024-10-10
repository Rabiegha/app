import {readFile as rnReadFile} from 'react-native-fs';

export const readFile = async filePath => {
  try {
    const fileContent = await rnReadFile(filePath, 'base64'); // Read file and convert to base64
    return fileContent; // Returns the content of the file in base64 format
  } catch (error) {
    console.error('Erreur de lecture du fichier :', error);
    throw error;
  }
};
