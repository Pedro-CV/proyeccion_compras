const { Op } = require("sequelize");
const { models } = require("../libs/sequelize");
const tf = require("@tensorflow/tfjs");

class ShoppingService {
  constructor() {}

  async find() {
    const res = await models.Shopping.findAll();
    return res;
  }

  async findOne(id) {
    const res = await models.Shopping.findByPk(id);
    return res;
  }

  async create(data) {
    const res = await models.Shopping.create(data);
    return res;
  }

  async update(id, data) {
    const model = await this.findOne(id);
    const res = await model.update(data);
    return res;
  }

  async delete(id) {
    const model = await this.findOne(id);
    await model.destroy();
    return { deleted: true };
  }
//
  //Creamos una funcion asincrona (para que se active hasta que termine de cargar la pagina)
  async learnLinear(startDate, endDate, product_barcode) {
    var res, size, pointer;
    await models.Shopping.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
        product_barcode: {
          [Op.eq]: product_barcode,
        },
      },
      order: [["createdAt", "ASC"]],
    })
      .then((data) => {
        res = data;

        size = data.length;
      })
      .catch((err) => {
        console.error(err);
      });

    if (res.length <= 1) {
      return { message: "Just one Data" };
    }
    pointer = res[0];
    res.shift();
    // return res;
    var n = 1;
    var linea = [];
    var valX = [];
    var valY = [];
    var quantityByDate = 0;

    linea.push(new Punto(n, pointer.createdAt, pointer.quantity));
    valX.push(n);
    valY.push(pointer.quantity);

    res.forEach((dateElement) => {
      let diffMiliseconds = dateElement["createdAt"] - pointer["createdAt"];
      let diffDays = Math.floor(diffMiliseconds / (1000 * 60 * 60 * 24));
      n++;
      quantityByDate += dateElement.quantity;
      console.log(n);
      if (diffDays > 0) {
        linea.push(new Punto(n, dateElement["createdAt"], quantityByDate));
        valX.push(n);
        valY.push(quantityByDate);
        quantityByDate = 0;
      }
      pointer = dateElement;
    });

    startDate = new Date(startDate);
    endDate = new Date(endDate);
    var period = Math.floor( (endDate - startDate) / (1000 * 60 * 60 * 24));
    
    const model = tf.sequential();
    //Agregamos una capa densa porque todos los nodos estan conectado entre si
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

    // Compilamos el modelo con un sistema de perdida de cuadratico y optimizamos con sdg
    model.compile({ loss: "meanSquaredError", optimizer: "sgd" });
    // Creamos los tensores para x y para y
    const xs = tf.tensor2d(valX, [valX.length, 1]);
    const ys = tf.tensor2d(valY, [valY.length, 1]);
    var lineaTensor = [];

    var cursorDate = new Date(linea[0].date);
    var cursorAux = new Date(linea[0].date);
    console.log(cursorDate);
    await model.fit(xs, ys, {epochs : 2000}).then(() => {
      for (let index = 1; cursorDate <= endDate; index++) {
        var prediccionY = model.predict(tf.tensor2d([index], [1, 1])).dataSync()[0];
        
        lineaTensor.push(new Punto(index, cursorDate , prediccionY));
        console.log(cursorDate);

        cursorDate = new Date(cursorAux.setDate(cursorAux.getDate() + 30));
      }
    })
    // console.log(valY);
    res = { "original" : linea, "predict" : lineaTensor};
    return res;
  }
}

class Punto {
  constructor(number, date, measure) {
    this.number = number;
    this.date = date;
    this.measure = measure;
  }
}

module.exports = ShoppingService;
