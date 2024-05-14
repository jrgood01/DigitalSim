export async function onRequest(request) {
    // Ensure this is a POST request
    if (request.request.method !== 'POST') {
        return new Response('Invalid request method', { status: 405 });
    }

    // Parse the request body as JSON
    const { email, password } = await request.request.json();

    console.log(request.env)
    console.log("INVOKE!");

    const response = await fetch(`${request.env.SUPABASE_URL}/auth/v1/token?grant_type=password`, {
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

    const data = await response.json();
    console.log(data);
    if (data.error != undefined) {
        return new Response(JSON.stringify(data), { status: 400 });
    }
    //return data containing the token
    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
    });
}