export const getData = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) { throw new Error('Gefaald om URL te laden'); }
    let data = await res.json();
    return data;
  } catch (error) {
    console.error('Error bij het laden:', error);
  }
}

export const postData = async (data) => {
  await fetch('/api/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
}