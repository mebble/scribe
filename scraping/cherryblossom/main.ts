import { assert } from "jsr:@std/assert";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import Logger from "https://deno.land/x/logger@v1.1.6/logger.ts";
import { DOMParser } from "jsr:@b-fuze/deno-dom";

import "jsr:@std/dotenv/load";

const logger = new Logger();
const username = Deno.env.get("USERNAME") || "";
const password = Deno.env.get("PASSWORD") || "";
const ticketSite = "https://www.rockskitickets.com/cherryblossom24/"

type TicketType = {
  name: string;
  price: string;
  status: string;
}

function parseTicketBox(elem, selector) {
  const found =  elem.querySelector(selector)!
  assert(found, "Failed to parse the ticket box!")
  return found.textContent
}

function getTicketTypes(html: string): TicketType[] {
  const doc = new DOMParser().parseFromString(
    html,
    "text/html",
  );

  const ticketTypes: TicketType[] = Array.from(doc.querySelectorAll(".book-now.ticket-type")!)
    .map(ticketBox => {
      return {
        name: parseTicketBox(ticketBox, "h5.text-capitalize"),
        price: parseTicketBox(ticketBox, "h5.text-primary"),
        status: parseTicketBox(ticketBox, "a").trim().toLowerCase(),
      }
    })

  assert(ticketTypes.length > 0, "No ticket boxes were found!")

  return ticketTypes
}

async function sendMail(username, password, subject, body) {
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

  await client.send({
    from: username,
    to: username,
    subject: subject,
    content: "...",
    html: body,
  });

  await client.close();
}

function buildMailBody(tickets: TicketType[]): string {
  const ticketRows = tickets.map(ticket => `
    <tr>
      <th>${ticket.name}</th>
      <th>${ticket.price}</th>
      <th>${ticket.status}</th>
    </tr>`).join("")
  return `
    <h1>New tickets available!</h1>
    <table border="1" cellpadding="10">
      <tr>
        <th>Ticket</th>
        <th>Price</th>
        <th>Status</th>
      </tr>${ticketRows}
    </table>
    <br/>
    <a href="${ticketSite}">Click here</a> to book them!
  `
}

try {
  logger.info("getting ticket page")

  const res = await fetch(ticketSite)
  assert(res.status === 200, "Failed to fetch page")

  const tickets = getTicketTypes(await res.text())
  // const available = tickets.filter(t => t.status !== 'sold out')
  const available = tickets

  if (available.length > 0) {
    logger.info("tickets available!", { tickets: available })
    logger.info("notifying")
    await sendMail(username, password, "New tickets!", buildMailBody(available))
    logger.info("notified through email");
  } else {
    logger.info("all tickets sold out!", { tickets: tickets })
  }
} catch (exception) {
  logger.error(exception)
  Deno.exit(1)
}
