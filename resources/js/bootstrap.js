import axios from 'axios';

// Configurer axios pour envoyer le cookie XSRF-TOKEN avec chaque requête
// Laravel lit ce cookie et valide le token CSRF automatiquement
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

window.axios = axios;
