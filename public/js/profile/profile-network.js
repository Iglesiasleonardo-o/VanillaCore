export async function fetchProfile() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ data: {} });
        }, 300);
    });
}