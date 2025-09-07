using System.Security.Cryptography;
using System.Text;

namespace TicketResell.Services.Services.Crypto;

public class CryptoService : ICryptoService
{
    private readonly string key = "qxdBfW31GnjfHG621DCSquug8bRiFy38xCjZdbOoqCo07wOQDc";

    public string Decrypt(string cipherText)
    {
        var iv = new byte[16];
        var buffer = Convert.FromBase64String(cipherText);

        using (var aes = Aes.Create())
        {
            aes.Key = Encoding.UTF8.GetBytes(key);
            aes.IV = iv;

            var decryptor = aes.CreateDecryptor(aes.Key, aes.IV);

            using (var ms = new MemoryStream(buffer))
            {
                using (var cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read))
                {
                    using (var sr = new StreamReader(cs))
                    {
                        return sr.ReadToEnd();
                    }
                }
            }
        }
    }
}