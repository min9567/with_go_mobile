import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <App />
    </BrowserRouter>
)

// ✅ 서비스워커 등록 코드 추가
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw.js')
            .then((registration) => {
                console.log('✅ 서비스워커 등록 성공:', registration);
            })
            .catch((error) => {
                console.error('❌ 서비스워커 등록 실패:', error);
            });
    });
}