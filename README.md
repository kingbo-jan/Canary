# Canary

> Just as canaries were used in coal mines to detect dangerous gases before they could harm miners, Canary serves as an early warning system for digital threats. In the 19th century, these birds were exceptional risk predictors due to their sensitivity to carbon monoxide, helping prevent numerous mining incidents during industrialization.
> 
> — Bonney, A. Gale Ambassador at U of Oxford

## What is Canary?
Canary is an automatic user-friendly threat detection tool that emphasizes proactive security rather than reactive responses. By focusing on preventative measures before incidents occur, it helps users stay safe online before they encounter threats.

### Key Features

#### 🛡️ Phishing Detection Tool
Our flagship feature leverages industry-standard threat detection capabilities with a user-friendly approach:
- Automatic browser monitoring
- Real-time threat detection  
- Cross-referencing with multiple security databases
- Instant user notifications for suspicious links

#### What Sets Canary Apart?
Unlike traditional tools such as WOT, PhishTank, and VirusTotal that require manual URL submission, Canary:
- Automatically scans as users browse
- Provides real-time protection
- Offers proactive threat notifications
- Integrates seamlessly with daily browsing

## The Vision Behind Canary
> "It's really all about putting people at the forefront when we are designing and implementing security"
> 
> — Julie Haney, HCC program lead at NIST

### Why I Created This Tool
As someone transitioning into tech, I experienced firsthand how overwhelming cybersecurity tools can be. The existing security landscape presents two major challenges:

1. **Technical Complexity**: Most security tools are designed for industry professionals, making them inaccessible to everyday users.

2. **User Accessibility Gap**: While everyday users are most vulnerable to cyber attacks, they lack access to user-friendly security tools.

### The Solution
Canary bridges this gap by:
- Maintaining industry-standard security measures
- Presenting them in an accessible, user-friendly interface
- Focusing on human-centered cybersecurity design
- Making protection automatic and intuitive

### Mission
Our mission is to democratize cybersecurity by creating tools that are:
- Non-technical-user-friendly
- Industry-standard compliant
- Easy to configure
- Simple to use
- Effective in protecting users

---

## Getting Started
[Coming Soon]

## Features
[Coming Soon]

## Documentation
[Coming Soon]

## Contributing
[Coming Soon]

## License
[Coming Soon]

# Anti-Phishing Email check

## Spoofing

**Protocols:**

1. **SPF (Sender Policy Framework)**
    - 
2. **DKIM (Domain Keys Identified Mail)** 
3. **DMARC ((Domain-based Message Authentication, Reporting & Conformance)** 

**How to analyze a phishing attack:**

- Sender Address (kingbojan3@gmail.com)
- SMTP IP Address (127.0.0.1)
- Domain base (@gmail.com)
- Subject(sender address and SMTP address may be constantly changing)

**Email Header**

- header of the section of the email containing information such as sender, recipient, and date
- *Return-Path, Reply-To, Received*

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/606349b0-fe7a-45c4-82b8-def8ac34a550/f3deeeb6-0142-40db-8331-34af509235f5/image.png)

- this above can be used to determine header analysis to detect spam and track email’s route to ensure that it is from the right address

**what does it do?**

- From & To fields to find out who is sending the email and who is receiving.
- have to be downloaded in .eml formats (plain text file for emails)

**spam**

- can use header analysis and other methods to detect spam emails

## Important Fields:

- **from** (shows the name and email address of the sender)
- **to** (details of the recipient)
    - **CC** (carbon copy) → to keep people in the loop
    - **BCC** (blind carbon copy) → to keep people in the loop without other seeing who else is in the loop
- **date** (timestamp when the email is sent)
- **subject** (topic of the email)
- **Return-Path** (a.k.a Reply-To) → when replied to email, the reply is sent to the address specified in the Return-Path field.
- **Domain key and DKIM signatures** (email signatures that help email service providers identify and authenticate your emails, similar to SPF signatures)
- **Message-ID** (header that has a unique combination of letters that identifies each email) → no two emails will have the same Message-ID
- **MIME-Version** (multipurpose internet mail extension) → internet coding standard that converts non-text content into text so that the non-text content can be attached to a mail via SMTP (simple mail transfer protocol)
