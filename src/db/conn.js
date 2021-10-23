const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://CodeOctober:CodeOctober@cluster0.zwlrd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Mongo db is connected");
  })
  .catch((err) => {
    console.log(err);
  });
