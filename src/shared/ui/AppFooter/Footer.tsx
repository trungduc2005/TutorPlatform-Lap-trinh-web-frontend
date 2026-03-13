import { FaEnvelope, FaFacebookF, FaLocationDot, FaPhone } from "react-icons/fa6";
import "./Footer.css";

const CONTACT_ITEMS = [
    {
        icon: <FaLocationDot aria-hidden="true" />,
        text: "Học viện công nghệ bưu chính viễn thông",
    },
    {
        icon: <FaPhone aria-hidden="true" />,
        text: "0967-6666-40",
    },
    {
        icon: <FaEnvelope aria-hidden="true" />,
        text: "contact@ptit.edu.vn",
    },
];

const SOCIAL_ROWS = [
    {
        label: "Dành cho khách hàng:",
        colorClass: "site-footer__social-link--blue",
    },
    {
        label: "Dành cho gia sư:",
        colorClass: "site-footer__social-link--green",
    },
];

function Footer() {
    return (
        <footer className="site-footer">
            <div className="site-footer__panel">
                <div className="site-footer__content">
                    <section className="site-footer__column site-footer__column--contact">
                        <h2 className="site-footer__title">Liên hệ với chúng tôi</h2>

                        <ul className="site-footer__contact-list">
                            {CONTACT_ITEMS.map((item) => (
                                <li key={item.text} className="site-footer__contact-item">
                                    <span className="site-footer__contact-icon">{item.icon}</span>
                                    <span className="site-footer__contact-text">{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="site-footer__column site-footer__column--social">
                        <h2 className="site-footer__title">Kết nối với chúng tôi</h2>

                        <div className="site-footer__social-list">
                            {SOCIAL_ROWS.map((item) => (
                                <div key={item.label} className="site-footer__social-row">
                                    <span className="site-footer__social-label">{item.label}</span>

                                    <div className="site-footer__social-actions">
                                        <a
                                            className={`site-footer__social-link ${item.colorClass}`}
                                            href="https://facebook.com"
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label={`Facebook ${item.label}`}
                                        >
                                            <FaFacebookF aria-hidden="true" />
                                        </a>
                                        <a
                                            className="site-footer__social-text"
                                            href="https://facebook.com"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            fb
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
