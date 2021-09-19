import { CSSProperties } from 'react';

interface NotificationProps {
    style: CSSProperties;
    text: string;
}

function Notification({ text, style }: NotificationProps) {
    return (
        <div
            style={{
                display: 'inline-block',
                color: '#ddd',
                backgroundColor: '#222',
                padding: '0 .2em',
                margin: '0 0 0 .2em',
                ...style,
            }}
        >
            {text}
        </div>
    );
}

export default Notification;
