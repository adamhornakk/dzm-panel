# Dash Deployment on Ubuntu 22.04

This document provides instructions for deploying the Dash application on a fresh Ubuntu 22.04 server.

## Prerequisites

- A server running Ubuntu 22.04.
- A non-root user with `sudo` privileges.
- A Git repository for your project.

## Deployment Steps

1.  **Clone the Repository**

    First, you need to get the project files onto your server.

    ```bash
    git clone https://github.com/your-username/your-repo.git
    cd your-repo
    ```

2.  **Configure the Deployment Script**

    The `deploy.sh` script automates the setup process. You need to configure a few variables at the top of the script before running it.

    Open the script for editing:

    ```bash
    nano deploy.sh
    ```

    Update the following variables:

    -   `REPO_URL`: Your project's Git repository URL.
    -   `DB_NAME`: The name of the database to be created.
    -   `DB_USER`: The database user.
    -   `DB_PASSWORD`: A strong password for the database user.

    Save and close the file.

3.  **Make the Script Executable**

    ```bash
    chmod +x deploy.sh
    ```

4.  **Run the Deployment Script**

    Execute the script to start the deployment process:

    ```bash
    ./deploy.sh
    ```

    The script will:
    -   Install Node.js, npm, and MySQL.
    -   Guide you through a secure MySQL installation.
    -   Create a database and user.
    -   Set up a `.env.local` file with your database URL and a `NEXTAUTH_SECRET`.
    -   Install project dependencies.
    -   Run database migrations.
    -   Build the application for production.
    -   Use `pm2` to run the application and keep it alive.

5.  **Complete PM2 Setup**

    After the script finishes, `pm2` will output a command that you need to run. This command allows `pm2` to automatically restart your application on server reboots.

    Copy and run the command provided by the script. It will look something like this:

    ```bash
    sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u <your-user> --hp /home/<your-user>
    ```

6.  **Verify the Application**

    You can check the status of your application with:

    ```bash
    pm2 status
    ```

    Your application should now be running. If you have a firewall enabled, make sure to allow traffic on port 3000:

    ```bash
    sudo ufw allow 3000
    ```

    You should now be able to access your application at `http://<your-server-ip>:3000`.

## Managing the Application with PM2

-   **View logs:** `pm2 logs`
-   **Stop the application:** `pm2 stop dash`
-   **Restart the application:** `pm2 restart dash`
-   **Delete the application from PM2:** `pm2 delete dash`
