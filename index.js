const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 3001;
const app = express();
app.use(cors());
app.use(express.json());

app.use("/product", require("./routes/product"));
app.use("/unit", require("./routes/unit"));
app.use("/brand", require("./routes/brand.js"));
app.use("/category", require("./routes/category"));
app.use("/login", require("./routes/login"));
app.use("/inventory", require("./routes/inventory"));
app.use("/stores", require("./routes/store"));
app.use("/customer", require("./routes/customer"));
app.use("/employee", require("./routes/employee"));
app.use("/supplier", require("./routes/supplier"));
app.use("/account", require("./routes/account"));
app.use("/sale", require("./routes/sale"));
app.use("/purchase", require("./routes/purchase"));
app.use("/payment", require("./routes/payment"));
app.use("/journal", require("./routes/journal"));
app.use("/Invoice", require("./routes/Invoice"));

app.listen(process.env.PORT || 3001, function () {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});
