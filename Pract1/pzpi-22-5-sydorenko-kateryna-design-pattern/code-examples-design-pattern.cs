using System.Threading.Tasks;

public interface ICacheRepository<T> where T : class
{
    Task<List<T>> Get(string key);
    Task Set(string key, T value);
    Task Set(string key, List<T> value);
    Task Remove(string key);
}

public interface IAnswerRepository
{
    Task<List<Answer>> GetAnswers(long questionId);
}

public class Answer
{
    public long Id { get; set; }
    public string Text { get; set; }
    public long QuestionId { get; set; }
    public bool IsCorrect { get; set; }
}

public class AnswerRepository : IAnswerRepository
{
    public async Task<List<Answer>> GetAnswers(long questionId)
    {
        throw new NotImplementedException();
    }
}

public class InMemoryCacheRepository<T> : ICacheRepository<T>
    where T : class
{
    public async Task Remove(string key)
    {
        throw new NotImplementedException();
    }

    public async Task Set(string key, T value)
    {
        throw new NotImplementedException();
    }

    public async Task Set(string key, List<T> value)
    {
        throw new NotImplementedException();
    }

    public async Task<List<T>> Get(string key)
    {
        throw new NotImplementedException();
    }
}
public class CachedAnswerRepository : IAnswerRepository
{
    private readonly IAnswerRepository _answerRepository;
    private readonly ICacheRepository<Answer> _cacheRepository;
    public CachedAnswerRepository(
        IAnswerRepository answerRepository, 
        ICacheRepository<Answer> cacheRepository)
    {
        _answerRepository = answerRepository;
        _cacheRepository = cacheRepository;
    }

    public async Task<List<Answer>> GetAnswers(long questionId)
    {
        var answers = await _cacheRepository.Get(questionId.ToString());
        if (answers.Any())
        {
            return answers;
        }

        var dbAnswers = await _answerRepository.GetAnswers(questionId);

        await _cacheRepository.Set(questionId.ToString(), dbAnswers);

        return dbAnswers;
    }
}

public class Program
{
    public static async Task Main(string[] args)
    {
        var answerRepository = new AnswerRepository();
        var cacheRepository = new InMemoryCacheRepository<Answer>();
        var cachedAnswerRepository = new CachedAnswerRepository(answerRepository, cacheRepository);
        var answers = await cachedAnswerRepository.GetAnswers(1);
    }
}
