exports.handler = async function (event, context) {
  const FOOTBALL_API_KEY = process.env.FOOTBALL_API_KEY;

  try {
    const response = await fetch(
      "https://api.football-data.org/v4/competitions/WC/matches",
      {
        headers: {
          "X-Auth-Token": FOOTBALL_API_KEY,
        },
      },
    );

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // allows YOUR browser to read this
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Failed to fetch football data" }),
    };
  }
};
