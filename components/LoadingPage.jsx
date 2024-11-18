export default function LoadingPage() {
    return (
    <>
        <section className="fixed items-center justify-center w-full min-h-screen">
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
                <div className="w-12 h-12 border-t-4 border-yellow-200 border-solid rounded-full animate-spin"></div>
            </div>
        </section>
    </>
    );
}
