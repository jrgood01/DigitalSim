async function signUp(email, password, url, key) {
    console.log(process);
    console.log(`URL IS: ${url}`)
    const response = fetch(`${url}/auth/v1/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': key,
            'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });
    console.log("Recieved response");
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error.message);
    }
    
    return data;
}

export { signUp };