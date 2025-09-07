using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization.Metadata;

namespace Api.Utils;

public class JsonUtils
{
    public static void UpdateJsonValue(string propertyName, string filePath, object? newValue)
    {
        if (!File.Exists(filePath))
        {
            Console.WriteLine("The specified file does not exist.");
            return;
        }

        try
        {
            // Read JSON content from the file
            var jsonContent = File.ReadAllText(filePath);

            // Parse JSON content to a JsonNode object
            var jsonNode = JsonNode.Parse(jsonContent);

            if (jsonNode != null)
            {
                // Navigate through nested properties based on the provided property path
                var propertyPath = propertyName.Split(':');
                var currentNode = jsonNode;

                // Traverse to the nested object
                for (var i = 0; i < propertyPath.Length - 1; i++)
                {
                    currentNode = currentNode?[propertyPath[i]];

                    if (currentNode == null)
                    {
                        Console.WriteLine($"Property path '{propertyPath[i]}' not found in the JSON file.");
                        return;
                    }
                }

                // Update the value of the specified property
                var finalProperty = propertyPath[^1];
                if (currentNode?[finalProperty] != null)
                {
                    currentNode[finalProperty] = JsonValue.Create(newValue);

                    // Configure JsonSerializerOptions with DefaultJsonTypeInfoResolver
                    var options = new JsonSerializerOptions
                    {
                        WriteIndented = true,
                        TypeInfoResolver = new DefaultJsonTypeInfoResolver()
                    };

                    // Write the updated JSON back to the file
                    File.WriteAllText(filePath, jsonNode.ToJsonString(options));

                    Console.WriteLine($"Successfully updated '{propertyName}' in the JSON file.");
                }
                else
                {
                    Console.WriteLine($"Property '{finalProperty}' not found in the JSON file.");
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred: {ex.Message}");
        }
    }
}