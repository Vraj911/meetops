import { motion } from "framer-motion";
const pageVariants = {
  initial: {
    opacity: 0,
    y: 8
  },
  animate: {
    opacity: 1,
    y: 0
  },
  exit: {
    opacity: 0,
    y: -8
  }
};
const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.3
};
function PageTransition({ children, className }) {
  return <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageVariants}
    transition={pageTransition}
    className={className}
  >{children}</motion.div>;
}
export {
  PageTransition
};
