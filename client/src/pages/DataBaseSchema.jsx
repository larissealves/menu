import React from 'react';

const models = [
  {
    title: '🥘 Dish',
    fields: [
      { name: 'id', type: 'Int', notes: 'Primary key, autoincrement' },
      { name: 'name', type: 'String', notes: 'Dish name' },
      { name: 'price', type: 'Float', notes: 'Price' },
      { name: 'description', type: 'String', notes: 'Description' },
      { name: 'categoryId', type: 'Int', notes: 'Foreign key → Category.id' },
      { name: 'isActive', type: 'Boolean', notes: 'default: true' },
      { name: 'createdAt', type: 'DateTime', notes: 'default: now()' },
    ],
    relations: [
      'category: belongs to Category',
      'images: has many DishImage[]',
      'ingredients: has many DishIngredient[]',
      'tags: has many DishTag[]',
    ],
  },
  {
    title: '📁 Category',
    fields: [
      { name: 'id', type: 'Int', notes: 'Primary key, autoincrement' },
      { name: 'name', type: 'String', notes: 'Category name' },
      { name: 'isActive', type: 'Boolean', notes: 'default: true' },
      { name: 'createdAt', type: 'DateTime', notes: 'default: now()' },
      { name: 'updatedAt', type: 'DateTime', notes: 'auto-updated on change' },
    ],
    relations: ['dishes: has many Dish[]'],
  },
  {
    title: '🧂 Ingredient',
    fields: [
      { name: 'id', type: 'Int', notes: 'Primary key, autoincrement' },
      { name: 'name', type: 'String', notes: 'Ingredient name' },
      { name: 'isActive', type: 'Boolean', notes: 'default: true' },
      { name: 'createdAt', type: 'DateTime', notes: 'default: now()' },
      { name: 'updatedAt', type: 'DateTime', notes: 'auto-updated on change' },
    ],
    relations: ['dishes: used in many DishIngredient[]'],
  },
  {
    title: '🔗 DishIngredient',
    fields: [
      { name: 'id', type: 'Int', notes: 'Primary key, autoincrement' },
      { name: 'dishId', type: 'Int', notes: 'Foreign key → Dish.id' },
      { name: 'ingredientId', type: 'Int', notes: 'Foreign key → Ingredient.id' },
      { name: 'createdAt', type: 'DateTime', notes: 'default: now()' },
      { name: 'updatedAt', type: 'DateTime', notes: 'auto-updated on change' },
    ],
    relations: ['dish: belongs to Dish', 'ingredient: belongs to Ingredient'],
  },
  {
    title: '🖼️ DishImage',
    fields: [
      { name: 'id', type: 'Int', notes: 'Primary key, autoincrement' },
      { name: 'dishId', type: 'Int', notes: 'Foreign key → Dish.id' },
      { name: 'imageName', type: 'String', notes: 'File name' },
      { name: 'imageType', type: 'String', notes: 'MIME type' },
      { name: 'isPrimary', type: 'Boolean', notes: 'default: false' },
      { name: 'createdAt', type: 'DateTime', notes: 'default: now()' },
      { name: 'updatedAt', type: 'DateTime', notes: 'auto-updated on change' },
    ],
    relations: ['dish: belongs to Dish', 'imageBinary: has one DishImageBinary?'],
  },
  {
    title: '💾 DishImageBinary',
    fields: [
      { name: 'id', type: 'Int', notes: 'Primary key, autoincrement' },
      { name: 'dishImageId', type: 'Int', notes: 'Unique foreign key → DishImage.id' },
      { name: 'binaryData', type: 'Bytes', notes: 'Raw binary image data' },
    ],
    relations: ['dishImage: belongs to DishImage'],
  },
  {
    title: '🏷️ Tag',
    fields: [
      { name: 'id', type: 'Int', notes: 'Primary key, autoincrement' },
      { name: 'name', type: 'String', notes: 'Tag name' },
      { name: 'isActive', type: 'Boolean', notes: 'default: true' },
      { name: 'createdAt', type: 'DateTime', notes: 'default: now()' },
      { name: 'updatedAt', type: 'DateTime', notes: 'auto-updated on change' },
    ],
    relations: ['dishes: used in many DishTag[]'],
  },
  {
    title: '🔖 DishTag',
    fields: [
      { name: 'id', type: 'Int', notes: 'Primary key, autoincrement' },
      { name: 'dishId', type: 'Int', notes: 'Foreign key → Dish.id' },
      { name: 'tagId', type: 'Int', notes: 'Foreign key → Tag.id' },
      { name: 'isActive', type: 'Boolean', notes: 'default: true' },
      { name: 'createdAt', type: 'DateTime', notes: 'default: now()' },
      { name: 'updatedAt', type: 'DateTime', notes: 'auto-updated on change' },
    ],
    relations: ['dish: belongs to Dish', 'tag: belongs to Tag'],
  },
];

export default function DatabaseSchema() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🗃️ Database Schema – Menu App</h1>
      <p className="mb-8 text-gray-700">Built with Prisma + PostgreSQL</p>
      {models.map((model) => (
        <div key={model.title} className="mb-10 border rounded-xl p-4 shadow">
          <h2 className="text-2xl font-semibold mb-4">{model.title}</h2>
          <table className="w-full text-left table-auto border mb-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Field</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Notes</th>
              </tr>
            </thead>
            <tbody>
              {model.fields.map((field) => (
                <tr key={field.name}>
                  <td className="p-2 border">{field.name}</td>
                  <td className="p-2 border">{field.type}</td>
                  <td className="p-2 border">{field.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {model.relations && (
            <div>
              <h3 className="font-semibold mb-2">Relations:</h3>
              <ul className="list-disc list-inside text-gray-700">
                {model.relations.map((relation, idx) => (
                  <li key={idx}>{relation}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
