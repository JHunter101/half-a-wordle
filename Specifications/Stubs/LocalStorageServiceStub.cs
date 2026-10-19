using System.Text.Json;

namespace Specifications.Stubs;

public sealed class LocalStorageServiceStub : ILocalStorageService
{
    private readonly Dictionary<string, string> _storage = [];

    public ValueTask<T?> GetAsync<T>(string key)
    {
        return !_storage.TryGetValue(key, out string? value)
            ? ValueTask.FromResult<T?>(default)
            : ValueTask.FromResult(
            JsonSerializer.Deserialize<T>(value));
    }

    public ValueTask SetAsync<T>(string key, T value)
    {
        _storage[key] = JsonSerializer.Serialize(value);

        return ValueTask.CompletedTask;
    }
}