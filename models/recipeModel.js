const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema for storing Recipe
const recipeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  recipeName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  image: {
    type: String,
    required: true,
  },
  preparationTime: {
    type: Number,
    required: true,
  },
  servingSize: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [String],
    required: true,
    validate: {
      validator: (val) => {
        return val.length > 0;
      },
      message: "Ingrediants cannot be empty",
    },
  },
  steps: {
    type: [String],
    required: true,
    validate: {
      validator: (val) => {
        return val.length > 0;
      },
      message: "Steps cannot be empty",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;