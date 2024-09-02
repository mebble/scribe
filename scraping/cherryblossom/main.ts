import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import Logger from "https://deno.land/x/logger@v1.1.6/logger.ts";
import { DOMParser } from "jsr:@b-fuze/deno-dom";

import "jsr:@std/dotenv/load";

const logger = new Logger();

const res = await fetch("https://www.rockskitickets.com/cherryblossom24/")
if (res.status === 200) {
  const tickets = getTicketTypes(await res.text())
  const available = tickets.filter(t => t.status !== 'sold out')
  if (available.length > 0) {
    logger.info("Tickets available!", { tickets: available })
  } else {
    logger.info("All tickets sold out!", { tickets: tickets })
  }
} else {
  logger.error("Failed to fetch page", { status: res.status })
}

type TicketType = {
  name: string;
  price: string;
  status: string;
}

function getTicketTypes(html: string): TicketType[] {
  const doc = new DOMParser().parseFromString(
    html,
    "text/html",
  );
  // TODO: error if not ticket types exist
  // TODO: error if parsing any one fails
  const ticketTypes: TicketType[] = Array.from(doc.querySelectorAll(".book-now.ticket-type")!)
    .map(ticketBox => {
      return {
        name: (ticketBox.querySelector("h5.text-capitalize")!).textContent,
        price: (ticketBox.querySelector("h5.text-primary")!).textContent,
        status: (ticketBox.querySelector("a")!).textContent.trim().toLowerCase(),
      }
    })
  return ticketTypes
}

async function sendMail() {
  const username = Deno.env.get("USERNAME") || "";
  const password = Deno.env.get("PASSWORD") || "";

  logger.info("using email address", { email: username });

  const client = new SMTPClient({
    connection: {
      hostname: "smtp.gmail.com",
      port: 465,
      tls: true,
      auth: {
        username: username,
        password: password,
      },
    },
  });

  logger.info("successfully connected. Sending mail");

  await client.send({
    from: username,
    to: username,
    subject: "example",
    content: "Hohohehe",
    html: "<p><h1>Test 2</h1>hoho</p>",
  });

  logger.info("successfully sent!");

  await client.close();

  logger.info("closed connection");
}
