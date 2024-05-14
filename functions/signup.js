export async function onRequest(request) {
    if (request.method !== 'POST') {
        return new Response('Invalid request method', { status: 405 });
    }

    const { email, password } = await request.json();

    console.log(request.env)
    console.log("INVOKE!");

    const response = await fetch(`${request.env.SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': request.env.SUPABASE_KEY,
            'Authorization': `Bearer ${request.env.SUPABASE_KEY}`
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    console.log(response);
    return new Response("Success!")
}