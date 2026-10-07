import java.net.DatagramSocket;
import java.net.DatagramSocketException;

public class Application {
    public static void main(String[] args) {
        try {
            System.out.println("Attempting to initialize UDP socket...");
            InventorySocket.initializeUDPSocket();
            System.out.println("UDP socket initialized successfully.");
        } catch (DatagramSocketException e) {
            System.err.println("Error: " + e.getMessage());
            System.exit(1);
        }
    }
}