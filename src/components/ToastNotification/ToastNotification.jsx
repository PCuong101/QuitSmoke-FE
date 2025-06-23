import { CheckCircle } from 'lucide-react';

function ToastNotification({ message, show }) {
    // Component sẽ được render, nhưng chỉ hiển thị khi prop 'show' là true
    return (
        <div className={`toast-notification ${show ? 'show' : ''}`}>
            <CheckCircle size={24} color="#16a34a" />
            <p>{message}</p>
        </div>
    );
}

export default ToastNotification;