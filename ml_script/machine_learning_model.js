const mongoose = require("mongoose");
const tf = require("@tensorflow/tfjs-node");
const moment = require("moment");

mongoose
    .connect("mongodb://127.0.0.1:27017/kidosmotors", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected..."))
    .catch((err) => console.error("MongoDB connection error:", err));

const Product = mongoose.model("products");

async function createDiscountModel() {
    const model = tf.sequential();
    model.add(
        tf.layers.dense({ inputShape: [1], units: 1, activation: "linear" })
    );
    model.compile({ optimizer: "sgd", loss: "meanSquaredError" });

    const views = tf.tensor1d([10, 50, 100, 200, 300]);
    const discounts = tf.tensor1d([5, 10, 15, 20, 25]);
    await model.fit(views, discounts, { epochs: 100 });
    return model;
}

async function getRecentViews(productId) {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found!");

    const recentViews = product.views || [];

    const threeDaysAgo = moment().subtract(3, "days").toDate();
    const viewsCount = recentViews
        .filter((view) => view.date >= threeDaysAgo)
        .reduce((total, view) => total + view.count, 0);

    return viewsCount;
}

async function applyDiscount(productId) {
    try {
        const product = await Product.findById(productId);
        if (!product) throw new Error("Product not found!");

        const viewsCount = await getRecentViews(productId);

        const model = await createDiscountModel();
        const discountTensor = model.predict(tf.tensor1d([viewsCount]));
        const discountPercentage = discountTensor.dataSync()[0];

        const newPrice = product.price * (1 - discountPercentage / 100);
        console.log(`Original Price: $${product.price}`);
        console.log(`Discount: ${discountPercentage.toFixed(2)}%`);
        console.log(`New Price: $${newPrice.toFixed(2)}`);

        product.oldPrice = product.price;
        product.price = newPrice.toFixed(2);
        await product.save();

        console.log("Product price updated successfully!");
    } catch (err) {
        console.error("Error applying discount:", err.message);
    }
}

(async () => {
    const productId = "YOUR_PRODUCT_ID_HERE"; 
    await applyDiscount(productId);
})();
