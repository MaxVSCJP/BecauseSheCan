function generateAvatar() {
  const seed = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const style = 'adventurer';
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
}

module.exports = { generateAvatar };
