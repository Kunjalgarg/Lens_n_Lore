const path = require("path");
const fs = require("fs");
const db = require("../config/db");

const IMAGES_DIR = path.join(__dirname, "..", "images");

exports.requestDownload = (req, res) => {
  const { user, image } = req.body;

  if (!user || !image) return res.status(400).send("Missing data");

  if (user.toLowerCase() === "kunjal") {
    savePermission(user, image, true, res);
  } else {
    console.log(`🔔 Download requested by ${user} for ${image}`);
    // Auto-deny; you can set up a manual approval process here
    savePermission(user, image, false, res);
  }
};

function savePermission(user, image, allowed, res) {
  const query =
    "INSERT INTO permissions (username, image_name, allowed) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE allowed = ?";
  db.query(query, [user, image, allowed, allowed], (err) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).send("DB error");
    }
    res.json({ allowed });
  });
}

exports.downloadImage = (req, res) => {
  const imageName = req.params.imageName;
  const user = req.query.user;
  if (!user) return res.status(400).send("User required");

  const query =
    "SELECT allowed FROM permissions WHERE username = ? AND image_name = ?";
  db.query(query, [user, imageName], (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).send("DB error");
    }

    if (!results.length || !results[0].allowed) {
      return res.status(403).send("Permission denied");
    }

    const filePath = path.join(IMAGES_DIR, imageName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).send("Image not found");
    }

    res.download(filePath);
  });
};
