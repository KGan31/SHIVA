from sklearn.metrics.pairwise import cosine_similarity


def calculate_similarity(embedding1, embedding2):
    """Calculates cosine similarity between two embeddings.

    Args:
        embedding1 (np.ndarray): First embedding vector (assumed to be 2D).
        embedding2 (np.ndarray): Second embedding vector (assumed to be 2D).

    Returns:
        float: Cosine similarity score between the embeddings.
    """

    return cosine_similarity(embedding1.reshape(1, -1), embedding2.reshape(1, -1))[0][0]
