import styles from "./NotFoundPage.module.css";

const NotFoundPage = () => {
  return (
    <div className={styles["not-found-page-container"]}>
        <h1>404</h1>
        <span> | </span>
        <h2>Page not found</h2>
    </div>
  )
}

export default NotFoundPage