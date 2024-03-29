import path from 'path';
import { rm } from 'fs';
import randomize from '../utils/randomize.js';
import { contributor, products, waiting, users } from '../models/models.js';

export const allProducts = async (request, response) => {
  const productData = await products.findAll();
  response.status(200).json(productData);
};

export const productById = async (request, response) => {
  const { vid } = request.params;
  const data = await products.findAll({ where: { vid }, attributes: ['price', 'desc', 'title', 'by', 'img', 'vid', 'ctg', 'createdAt', 'tech'] });
  if (!data) return response.status(404).json('product not found');
  response.status(200).json(data);
};

export const productsByCategory = async (request, response) => {
  const { ctg } = request.params;
  const data = await products.findAll({ where: { ctg }, attributes: ['price', 'desc', 'title', 'by', 'img', 'vid', 'tech', 'ctg'] })
  if (!data) return response.status(404).json('products not found!');
  response.status(200).json(data);
};

export const createProduct = async (request, response) => {
  const vxrft = request.cookies.vxrft
  if (!vxrft) return response.status(403).json("you don't have access!")
  const user = await contributor.findOne({ where: { vxrft } });
  if (!user) return response.status(403).json("you don't have access!");
  const { file, img } = request.files;
  const { title, desc, ctg, price, tech } = request.body;
  if (!title || !desc || !ctg || !price || !file || !img || !tech ) return response.status(403).json('please complete the data!');
  if (ctg !== 'web' && ctg !== 'video' && ctg !== 'vector') return response.status(403).json('category not available');
  if (desc.length <= 30 || desc.length >= 100) return response.status(422).json('description Min 30 - Max 100 character');

  // handle image
  const imgType = ['.jpg', '.png', '.jpeg', '.mp4', '.mov'];
  const imgExt = path.extname(img.name);
  const imgName = img.md5 + imgExt;
  const imgSize = img.data.length;
  const imgPath = `./public/images/product/${imgName}`;
  const imgUrl = `${request.protocol}://${request.get('host')}/images/product/${imgName}`;
  if (!imgType.includes(imgExt.toLowerCase())) return response.status(403).json('preview format is not supported');
  if (imgSize > 5000000 * 2) return response.status(403).json('preview size must be less than 10 MB');

  // handle file
  const fileType = ['.zip', '.rar'];
  const fileExt = path.extname(file.name);
  const fileSize = file.data.length;
  const fileName = file.md5 + fileExt;
  const filePath = `./public/files/${fileName}`;
  const fileUrl = `${request.protocol}://${request.get('host')}/files/${fileName}`;
  if (!fileType.includes(fileExt.toLowerCase())) return response.status(403).json('file format is not supported');
  if (fileSize > 5000000 * 4) return response.status(403).json('file size must be less than 20 MB');

  try {
    await waiting.create({
      title, tech, desc, price, ctg, img: imgUrl, file: fileUrl, by: user.username, vid: randomize(5),
    });
    img.mv(imgPath);
    file.mv(filePath);
    response.status(201).json('product has been successfully created and will be reviewed');
  } catch (error) {
    return response.status(403).json(error.message);
  }
};

export const waitingList = async (request, response) => {
  const author = request.headers.author
  if (author !== process.env.admin_pass) return response.status(403).json('only admin can access!');
  const data = await waiting.findAll()
  response.status(200).json(data)
};

export const waitingById = async (request, response) => {
  const author = request.headers.author
  if (author !== process.env.admin_pass) return response.status(403).json('only admin can access!');
  const { vid } = request.params;
  const data = await waiting.findAll({ where: { vid }, attributes: ['price', 'desc', 'title', 'by', 'img', 'vid', 'ctg', 'createdAt', 'tech'] });
  if (!data) return response.status(404).json('product not found');
  response.status(200).json(data);
}

export const confirmProduct = async (request, response) => {
  const author = request.headers.author
  const { vid } = request.params;
  if (author !== process.env.admin_pass) return response.status(403).json('only admin can access!');
  const data = await waiting.findOne({ where: { vid } });
  if (!data) return response.status(404).json('product data not found');
  try {
    await products.create({
      vid: data.vid, price: data.price, title: data.title, tech: data.tech, desc: data.desc, file: data.file, img: data.img, ctg: data.ctg, by: data.by,
    });
    await waiting.destroy({ where: { vid } })
    return response.status(201).json('product verification successful');
  } catch (error) {
    return response.status(433).json(error.message);
  }
};

export const rejectProduct = async (request, response) => {
  const author = request.headers.author
  const { vid } = request.params;
  if (author !== process.env.admin_pass) return response.status(403).json('only admin can access!');
  const data = await waiting.findOne({ where: { vid } });
  if (!data) return response.status(404).json('product data not found');
  try {
    await waiting.destroy({ where: { vid } });
    const fileUrl = `${request.protocol}://${request.get('host')}/files/`;
    const imgUrl = `${request.protocol}://${request.get('host')}/images/product/`;
    rm(`./public/images/product/${data.img.slice(imgUrl.length)}`, (error) => error && console.log(error.message));
    rm(`./public/files/${data.file.slice(fileUrl.length)}`, (error) => error && console.log(error.message));
    return response.status(200).json('product successfully rejected');
  } catch (error) {
    return response.status(433).json(error.message);
  }
};

export const deleteProduct = async (request, response) => {
  const { id } = request.params;
  if (!request.cookies.reftoken) return response.status(403).json('only admin can access!');
  const user = await users.findOne({ reftoken: request.cookies.reftoken });
  if (!user) return response.status(403).json('only admin can access!');
  const product = await products.findOne({ id });
  if (!product) return response.status(404).json('product data not found');
  try {
    const fileUrl = `${request.protocol}://${request.get('host')}/files/`;
    const imgUrl = `${request.protocol}://${request.get('host')}/images/product/`;
    await product.findOneAndDelete({ _id: request.body.id });
    rm(`./public/images/product/${product.img.slice(imgUrl.length)}`, (error) => error && console.log(error.message));
    rm(`./public/files/${product.file.slice(fileUrl.length)}`, (error) => error && console.log(error.message));
    return response.status(200).json('product data has been successfully deleted');
  } catch (error) {
    return response.status(400).json(error.message);
  }
};

export const downloadProduct = async (request, response) => {
  const { reftoken } = request.cookies;
  if (!reftoken) return response.status(404).json('kamu tidak memiliki akses');
  const user = await users.findOne({ where: { reftoken } });
  if (!user) return response.status(403).json('akun kamu tidak terverifikasi');
  const data = await products.findOne({ where: { id: request.params.id } });
  if (!data) return response.status(404).json('product file tidak ditemukan');
  return response.status(200).json(data.file);
};
