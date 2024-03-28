 function personalizeMessage(name, message) {
  return message.replace('[nama]', name);
}

// Contoh penggunaan:
// const message = 'Hei [nama], ingatlah bahwa perasaan sedih hanya sementara. Mari hadapi hari ini dengan semangat baru dan keberanian! 💕😊';
// console.log(personalizeMessage('John', message));

module.exports = {
    personalizeMessage,
}