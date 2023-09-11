import Layout from "../layouts/Layout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <Layout>
            <motion.div
                initial={{ y: 30 }}
                animate={{ y: 0 }}
                className="flex flex-col gap-20"
            >
                <h1 className="text-4xl text-center font-bold">
                    Добрый день уважаемый пользователь
                </h1>
                <Link
                    to="/camera"
                    className="p-4 ring-2 text-center ring-black rounded-full text-2xl"
                >
                    Старт
                </Link>
            </motion.div>
        </Layout>
    );
};

export default HomePage;
