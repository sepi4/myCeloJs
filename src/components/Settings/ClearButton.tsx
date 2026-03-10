import styles from './ClearButton.module.css'

interface Props {
    testId: string
    title?: string
    onClick: () => void
}

function ClearButton({ testId, title, onClick }: Props) {
    return (
        <button data-testid={testId} className={styles.clearButton} onClick={onClick} title={title}>
            ✕
        </button>
    )
}

export default ClearButton
