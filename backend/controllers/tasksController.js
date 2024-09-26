const Task = require("../models/Task"); // Importer le modèle Task
const User = require("../models/User"); // Importer le modèle User (si nécessaire)

// Créer une tâche
exports.createTask = async (req, res) => {
  try {
    const { text, completed, addByAdmin, ownerId } = req.body;

    // Rechercher l'utilisateur propriétaire de la tâche
    const owner = await User.findById(ownerId);
    if (!owner) {
      console.log("Utilisateur non trouvé :", ownerId);
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Créer la tâche
    const newTask = new Task({
      text,
      completed: completed || false, // Si completed n'est pas défini, il est mis à false
      addByAdmin: addByAdmin || false, // Si addByAdmin n'est pas défini, il est mis à false
      owner: owner._id,
    });

    // Sauvegarder la tâche dans la base de données
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de la tâche", error });
  }
};

// Récupérer toutes les tâches
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("owner"); // Optionnel: utiliser populate pour récupérer l'utilisateur
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des tâches", error });
  }
};

// Récupérer une tâche par ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("owner");
    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de la tâche", error });
  }
};

// Mettre à jour une tâche
exports.updateTask = async (req, res) => {
  try {
    const { text, completed, addByAdmin } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        text,
        completed,
        addByAdmin,
      },
      { new: true } // Retourner la tâche mise à jour
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la tâche", error });
  }
};

// Supprimer une tâche
exports.deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    res.status(200).json({ message: "Tâche supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de la tâche", error });
  }
};
