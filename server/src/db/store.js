const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DB_DIR = path.join(__dirname, '../../db');
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

function getCollection(name) {
  const file = path.join(DB_DIR, `${name}.json`);
  if (!fs.existsSync(file)) fs.writeFileSync(file, '[]');
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function saveCollection(name, data) {
  const file = path.join(DB_DIR, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function createStore(name) {
  return {
    findAll: (predicate) => {
      const data = getCollection(name);
      return predicate ? data.filter(predicate) : data;
    },
    findOne: (predicate) => getCollection(name).find(predicate) || null,
    findById: (id) => getCollection(name).find((d) => d._id === id) || null,
    insert: (doc) => {
      const data = getCollection(name);
      const newDoc = { _id: uuidv4(), createdAt: new Date().toISOString(), ...doc };
      data.push(newDoc);
      saveCollection(name, data);
      return newDoc;
    },
    updateById: (id, updates) => {
      const data = getCollection(name);
      const idx = data.findIndex((d) => d._id === id);
      if (idx === -1) return null;
      data[idx] = { ...data[idx], ...updates };
      saveCollection(name, data);
      return data[idx];
    },
    count: () => getCollection(name).length,
  };
}

module.exports = { createStore };
