import styles from "./MobilePage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const MobilePage = () => {
  return (
    <div className={styles.mobile}>
        <h1>Welcome to Chess!</h1>
        <h3>Install our app for your system</h3>
        <div className={styles.systems}>
            <a href="#">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="4 32 376.4 449.4" width="90" height="90"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
            </a>
            <a href="#">
                <svg height="90" viewBox="42.544 -.671 467.96 553.72" width="90" xmlns="http://www.w3.org/2000/svg"><path d="m76.774 179.141c-9.529 0-17.614 3.323-24.26 9.969s-9.97 14.621-9.97 23.929v142.914c0 9.541 3.323 17.619 9.97 24.266 6.646 6.646 14.731 9.97 24.26 9.97 9.522 0 17.558-3.323 24.101-9.97 6.53-6.646 9.804-14.725 9.804-24.266v-142.914c0-9.309-3.323-17.283-9.97-23.929s-14.627-9.969-23.935-9.969zm275.198-128.294 23.598-43.532c1.549-2.882.998-5.092-1.658-6.646-2.883-1.34-5.098-.661-6.646 1.989l-23.928 43.88c-21.055-9.309-43.324-13.972-66.807-13.972-23.488 0-45.759 4.664-66.806 13.972l-23.929-43.88c-1.555-2.65-3.77-3.323-6.646-1.989-2.662 1.561-3.213 3.764-1.658 6.646l23.599 43.532c-23.929 12.203-42.987 29.198-57.167 51.022-14.18 21.836-21.273 45.698-21.273 71.628h307.426c0-25.924-7.094-49.787-21.273-71.628-14.181-21.824-33.129-38.819-56.832-51.022zm-136.433 63.318c-2.552 2.558-5.6 3.831-9.143 3.831-3.55 0-6.536-1.273-8.972-3.831-2.436-2.546-3.654-5.582-3.654-9.137 0-3.543 1.218-6.585 3.654-9.137 2.436-2.546 5.429-3.819 8.972-3.819s6.591 1.273 9.143 3.819c2.546 2.558 3.825 5.594 3.825 9.137-.007 3.549-1.285 6.591-3.825 9.137zm140.086 0c-2.441 2.558-5.434 3.831-8.971 3.831-3.551 0-6.598-1.273-9.145-3.831-2.551-2.546-3.824-5.582-3.824-9.137 0-3.543 1.273-6.585 3.824-9.137 2.547-2.546 5.594-3.819 9.145-3.819 3.543 0 6.529 1.273 8.971 3.819 2.438 2.558 3.654 5.594 3.654 9.137 0 3.549-1.217 6.591-3.654 9.137zm-231.654 292.639c0 10.202 3.543 18.838 10.63 25.925 7.093 7.087 15.729 10.63 25.924 10.63h24.596l.337 75.454c0 9.528 3.323 17.619 9.969 24.266s14.627 9.97 23.929 9.97c9.523 0 17.613-3.323 24.26-9.97s9.97-14.737 9.97-24.266v-75.447h45.864v75.447c0 9.528 3.322 17.619 9.969 24.266s14.73 9.97 24.26 9.97c9.523 0 17.613-3.323 24.26-9.97s9.969-14.737 9.969-24.266v-75.447h24.928c9.969 0 18.494-3.544 25.594-10.631 7.086-7.087 10.631-15.723 10.631-25.924v-221.361h-305.09zm352.304-227.663c-9.309 0-17.283 3.274-23.93 9.804-6.646 6.542-9.969 14.578-9.969 24.094v142.914c0 9.541 3.322 17.619 9.969 24.266s14.627 9.97 23.93 9.97c9.523 0 17.613-3.323 24.26-9.97s9.969-14.725 9.969-24.266v-142.914c0-9.517-3.322-17.552-9.969-24.094-6.647-6.53-14.737-9.804-24.26-9.804z"/></svg>
            </a>
        </div>
    </div>
  )
}

export default MobilePage