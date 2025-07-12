import axios from '../api'; // ou axios directement

const login = async (email, password) => {
  try {
    const response = await axios.post('/login', { email, password });
    const { token, user } = response.data;

    // Sauvegarder le token dans localStorage
    localStorage.setItem('token', token);
    return { success: true, user };
  } catch (err) {
    return { success: false, error: err.response?.data?.error || 'Erreur de connexion' };
  }
};

export default login;
