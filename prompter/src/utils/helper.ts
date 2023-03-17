export const exportText = (text: string) => {
  // create a new text file
  const file = new Blob([text], { type: 'text/plain' });

  // create a new download link
  const a = document.createElement('a');
  const url = URL.createObjectURL(file);
  a.href = url;
  a.download = 'translation.txt';

  // simulate a click on the download link to initiate the download
  a.click();

  // clean up the URL object
  URL.revokeObjectURL(url);
};
