const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Configuração do armazenamento de arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'images')); // Diretório para salvar as imagens
    },
    filename: (req, file, cb) => {
        // Gerar hash para o nome do arquivo
        const hash = crypto.createHash('md5').update(file.originalname + Date.now()).digest('hex');
        const ext = path.extname(file.originalname);
        cb(null, `${hash}${ext}`);
    }
});

// Configurar multer
const upload = multer({ storage: storage });

module.exports = upload;
