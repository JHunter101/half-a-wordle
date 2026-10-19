using System.Text.Json;
using Microsoft.JSInterop;

namespace Core.Services;

public interface ILocalStorageService
{
    ValueTask<T?> GetAsync<T>(string key);

    ValueTask SetAsync<T>(string key, T value);
}

public sealed class LocalStorageService(IJSRuntime js) : ILocalStorageService
{
    public async ValueTask<T?> GetAsync<T>(string key)
    {
        string? json = await js.InvokeAsync<string?>("localStorage.getItem", key);

        return json is null
            ? default
            : JsonSerializer.Deserialize<T>(json);
    }

    public async ValueTask SetAsync<T>(string key, T value)
    {
        string json = JsonSerializer.Serialize(value);

        await js.InvokeVoidAsync("localStorage.setItem", key, json);
    }
}