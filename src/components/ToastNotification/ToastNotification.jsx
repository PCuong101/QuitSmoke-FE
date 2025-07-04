import './ToastNotification.css'; // Import file CSS để định dạng

function ToastNotification(props) {
    // Component sẽ được render, nhưng chỉ hiển thị khi prop 'show' là true
    const IconComponent = props.icon;
    return (
        <div className={`toast-notification ${props.show ? 'show' : ''}`}>
            <IconComponent size={24} color={props.color} />
            <p>{props.message}</p>
        </div>
    );
}

export default ToastNotification;