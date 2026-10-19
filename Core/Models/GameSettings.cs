namespace Core.Models;

public class GameSettings
{
    public int WordLength { get; set; } = 5;
    public int MaxGuesses { get; set; } = 6;
    public double TargetColoredLettersFromHints => WordLength / 2.5;
    public double MaxColoredLettersFromHints => WordLength / 2.5;
}