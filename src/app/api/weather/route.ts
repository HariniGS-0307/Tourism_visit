import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
      return NextResponse.json({ error: "Missing coordinates" }, { status: 400 });
    }

    // Proxy to OpenWeatherMap
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      // Mock response if API key is not set
      return NextResponse.json({
        weather: [{ main: "Clear", description: "clear sky", icon: "01d" }],
        main: { temp: 28.5, feels_like: 30.2, humidity: 65 },
        name: "Mock Location"
      });
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch weather");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching weather:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
