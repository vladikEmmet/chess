import styles from "./Loader.module.css";

const Loader = () => {
  return (
    <div className={styles.loaderWrap}>
        <div className={styles.loader}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
  )
}

export default Loader