# Node.js Express Backend Template

This project serves as a template for developing a Node.js Express backend. It provides a foundation for building robust and scalable backend applications using the Node.js runtime and Express framework.

## Setup

1. Clone the repository to your local machine.
2. Install dependencies using npm or yarn:

    ```bash
    npm install
    ```

    or

    ```bash
    yarn install
    ```

3. Configure the database connection in the `config/database.js` file.

## Required Tables

The following tables are required from the main database:

1. **map_role_permission**
2. **mst_user**
3. **mst_user_permission**
4. **mst_user_role**

Ensure that these tables are properly set up and accessible by the backend application.

## Required Views

The following view is required:

1. **v_users**

Make sure that the required views are created and configured appropriately in the database.

## Usage

1. Start the server:

    ```bash
    npm start
    ```

    or

    ```bash
    yarn start
    ```

2. Access the endpoints defined in the application to interact with the backend functionality.

## Contributing

Feel free to contribute to the improvement of this template by submitting pull requests or reporting issues.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
