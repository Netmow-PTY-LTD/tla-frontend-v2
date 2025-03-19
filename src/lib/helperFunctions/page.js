export const convertImageUrlToFile = async (input) => {
  if (typeof input === 'string' && input.startsWith('http')) {
    try {
      const response = await fetch(input);
      const blob = await response.blob();
      const fileName = input.split('/').pop();
      const fileType = input.split('.').pop();

      const file = new File([blob], fileName, {
        type: `application/${fileType}`,
      });

      return file;
    } catch (error) {
      console.error('Error fetching file from URL:', error);

      return null;
    }
  } else if (input instanceof File || input instanceof Blob) {
    return input;
  } else {
    return null;
  }
};
