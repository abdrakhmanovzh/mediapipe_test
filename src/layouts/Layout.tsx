interface Props {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
    return (
        <div className="h-[100svh] w-screen flex items-center justify-center p-4">
            {children}
        </div>
    );
};

export default Layout;
